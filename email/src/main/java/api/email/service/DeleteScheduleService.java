package api.email.service;


import api.email.controller.request.DeleteRequest;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeleteScheduleService {


    @Autowired
    Scheduler scheduler;

    public void delete(DeleteRequest request) throws SchedulerException {

        JobKey key = new JobKey(request.getName(), request.getGroup());

        scheduler.deleteJob(key);
    }
}
