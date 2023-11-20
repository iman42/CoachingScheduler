# Coaching Scheduler
by Ian Fanselow

## how to run
1. clone this repo
2. in your terminal at `CoachingScheduler/backend` run `python3 app.py`
3. in another tab in terminal at `CoachingScheduler/frontend` run `npm start`
4. the frontend command should open automatically in your browser, if it does not navigate to the url in the output.  By default it should be `http://localhost:3000`


# Features!
### Coaches
1. By going to `BASEURL/coach/NAME` you will see a calendar with all sessions created by `NAME` these will be color coded as follows 
    - Green = unbooked session
    - Blue = booked sesssion

2. If you click the red `DELETE` button it will delete the session.  

3. If you click on the event it will open a pop up where you can fill in your score and notes.  This will appear as two sequential inputs, and the score will be displayed in the middle of the session.  To view the notes you will have to click on the event again.

4. To create a new event, simply drag on the calendar from the starting time of the event to the end

5. Bonus feature, you can create events of any size not just 2 hours.  

### Students
1. By going to `BASEURL/student/ID_NUMBER` you will see a calendar with all sessions created by all coaches
    - Green = available
    - Blue = Session you booked
    - Red = Sesssion someone else booked

2. By left clicking on a green event it will immediately become booked on both your end and the coaches.

# Structure

- The structure of this project is a frontend that talks to a backend using a RESTful api
- the frontend is react, leveraging the `daypilot` module to render the calendar
- the backend is a `flask app` that writes to a database with SQLAlchemy


# What is it missing?
There are some things I wanted to add but didn't to keep within the 3 hour time-frame.  I wanted to highlight some of these things as well as future improvements.
- UNIT TESTS are the biggest thing missing from this project.  Having good test coverage is key to any project.  This would be the first thing I would add from this point

- Code Structure.  It is generally good practice to break up the logic and the api endpoints in the backend.  That is my preferred structure as it maximizes both code readability and reusability.  My original plan for the structure was the following 3 layers.
    - {API} < -- > {Controller}  < -- > {Adapter}
    
    - API would have all the endpoints seen in app.py that would call functions in Controller
    
    - Controller would have functions like `store_session()` that would be called by the API endpoint.  This would hold the logic of what exactly to do with the data.  For example, currently in app.py on line 93 there is `if obj.student == "":` which is making sure you aren't overriding a student.  The API shouldn't know how to interpret the data in this way, it simply should pass it along. This is the job for the Controller.
    
    - Finally the Adapter only knows how to handle interactions with the database.  So in the previous example, if the Controller determined a student should be able to book the session it would make a call to the adapter saying somethign along the lines of `write_student_to_row()` 

    - The benefit of this structure is that if something changes you only need to look in one place.  If we switch from SQL to postgres or to redshift then you only need to update how the adapter works, even all the function calls should be the same.  If we change the logic of how many students are allowed in a session, then we only need to update the Controller. Etc.

- Similarly I would update the structure of the front end.  Having a lot of checks in the calendar component on if the user is a coach or a student is kind of clunky.  Spending some time seeing which parts could become their own component would add a lot of adaptability.

- And finally, of course, having a log-in feature would be very important.  Having the current user just be pulled in from the URL is not standard practice, but intead, just enough to show the distinction between coach and student.

