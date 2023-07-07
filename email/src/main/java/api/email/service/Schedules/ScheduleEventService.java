package api.email.service.Schedules;


import api.email.controller.request.EmailRequest;
import api.email.controller.response.JobResponse;
import api.email.service.Jobs.SendEventEmailJob;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;
import java.time.ZonedDateTime;
import java.util.UUID;

@Service
public class ScheduleEventService {

    @Autowired
    Scheduler scheduler;

    public JobResponse scheduleEvent(EmailRequest request) {

        ZonedDateTime dateEvent = ZonedDateTime.of(request.getDate(), request.getZoneId());

        if (dateEvent.isBefore(ZonedDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "A data enviada esta defazada!!");
        }


        try {

            SendEventEmailJob sendEventEmailJob = new SendEventEmailJob();

            JobDataMap jobDataMap = new JobDataMap();
            jobDataMap.put("to", request.getTo());
            jobDataMap.put("subject", "Aviso de evento!!");
            jobDataMap.put("text", "Você tem um evento para amanha: " + request.getDescription());

            String jobName = UUID.randomUUID().toString();
            String jobGroup = "email-jobs";

            JobDetail newJob = JobBuilder.newJob(SendEventEmailJob.class)
                    .withIdentity(jobName, jobGroup)
                    .withDescription("Send Email Job")
                    .usingJobData(jobDataMap)
                    .storeDurably().build();

            Trigger trigger = TriggerBuilder
                    .newTrigger()
                    .withIdentity(newJob.getKey().getName(), "email-triggers")
                    .withDescription("Send Email Trigger")
                    .forJob(newJob)
                    .startAt(Date.from(dateEvent.toInstant()))
                    .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
                    .build();

            scheduler.scheduleJob(newJob, trigger);

            JobResponse jobResponse = new JobResponse();
            jobResponse.setName(jobName);
            jobResponse.setGroup(jobGroup);

            return jobResponse;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro ao realizar o agendamento!!");
        }
    }
}
