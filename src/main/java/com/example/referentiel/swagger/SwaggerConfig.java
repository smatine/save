package com.example.referentiel.swagger;

import static com.google.common.base.Predicates.or;
import static springfox.documentation.builders.PathSelectors.regex;

import java.text.Annotation;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.GetMapping;

import com.google.common.base.Predicate;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
import static com.google.common.base.Predicates.*;
import static com.google.common.collect.Lists.*;
import static springfox.documentation.builders.PathSelectors.*;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

  public static final Contact DEFAULT_CONTACT = new Contact(
      "Soufiane Matine", "http://www.smatine.com", "soufiane.matine@gmail.com");
  
  public static final ApiInfo DEFAULT_API_INFO = new ApiInfo(
      "API Title", "API Description", "1.0",
      "urn:tos", DEFAULT_CONTACT, 
      "Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0");

  private static final Set<String> DEFAULT_PRODUCES_AND_CONSUMES = 
      new HashSet<String>(Arrays.asList("application/json"/*,
          "application/xml"*/));

  @Bean
  public Docket api() {
    return new Docket(DocumentationType.SWAGGER_2)
        .apiInfo(DEFAULT_API_INFO)
        .produces(DEFAULT_PRODUCES_AND_CONSUMES)
        .consumes(DEFAULT_PRODUCES_AND_CONSUMES)
        .select() 
	    .apis(RequestHandlerSelectors.basePackage("com.example.referentiel.controller"))
	    .paths(refPaths())
	     //.paths(PathSelectors.any())
	      //.paths(PathSelectors.ant("/vpcs/*"))
	    //.paths(PathSelectors.regex(""))
	     .build()
	    ;
  }
  
  private Predicate<String> refPaths() {
      return or(
    		  regex("/trigrammes/*.*"),
    		  regex("/trigrammes2/*.*"),
              regex("/accounts/*.*"),
              regex("/products/*.*"),
              regex("/cidrs/*.*"),
              regex("/cidr/*.*"),
              regex("/subnetcidrs/*.*"),
              regex("/vpcs/*.*"),
              regex("/regions/*.*")
      );
  }
  
}