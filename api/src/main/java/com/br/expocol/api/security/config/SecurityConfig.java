package com.br.expocol.api.security.config;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    protected SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable().cors()
                .and()
                    .authorizeRequests().requestMatchers(POST, "/login").permitAll()
                .and()
                    .authorizeRequests().requestMatchers(POST, "/register").permitAll()
                .and()
                    .authorizeRequests().anyRequest().authenticated()
                .and()
                    .logout().logoutSuccessHandler((request, response, authentication) -> response.setStatus(OK.value()))
                .and()
                    .httpBasic().authenticationEntryPoint((request, response, authException) -> response.setStatus(UNAUTHORIZED.value()))
                .and()
                    .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)



        ;

        return http.build();
    }
}
