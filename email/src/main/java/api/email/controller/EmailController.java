package api.email.controller;


import api.email.controller.request.DeleteRequest;
import api.email.controller.request.EmailRequest;
import api.email.controller.response.JobResponse;
import api.email.service.DeleteScheduleService;
import api.email.service.Schedules.ScheduleEventService;
import jakarta.validation.Valid;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/email")
@RestController
public class EmailController {

    @Autowired
    ScheduleEventService scheduleEventService;

    @Autowired
    DeleteScheduleService deleteScheduleService;

    @PostMapping
    public JobResponse sendEmail(@Valid @RequestBody EmailRequest request){

        return scheduleEventService.scheduleEvent(request);

    }

    @DeleteMapping
    public void deleteSchedule(@RequestBody DeleteRequest request) throws SchedulerException {
        deleteScheduleService.delete(request);
    }


}
