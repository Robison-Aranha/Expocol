package api.email.service.Jobs;

import api.email.service.EmailSenderService;
import lombok.Data;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;

@Data
public class SendEventEmailJob implements Job {

    @Autowired
    EmailSenderService emailSenderService;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {

        JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();


        emailSenderService.sendSimpleMessage(jobDataMap.getString("to"), jobDataMap.getString("subject"), jobDataMap.getString("text"));

    }

}
