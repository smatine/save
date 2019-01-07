package com.example.referentiel.swagger;

import io.swagger.annotations.Contact;
import io.swagger.annotations.ExternalDocs;
import io.swagger.annotations.Info;
import io.swagger.annotations.License;
import io.swagger.annotations.SwaggerDefinition;

@SwaggerDefinition(
        info = @Info(
                description = "Resources",
                version = "V12.0.12",
                title = "Resource API",
                contact = @Contact(
                   name = "Soufiane Matine", 
                   email = "soufiane.matine@gmail.com", 
                   url = "http://www.smatine.com"
                ),
                license = @License(
                   name = "Apache 2.0", 
                   url = "http://www.apache.org/licenses/LICENSE-2.0"
                )
        ),
        consumes = {"application/json", "application/xml"},
        produces = {"application/json", "application/xml"},
        schemes = {SwaggerDefinition.Scheme.HTTP, SwaggerDefinition.Scheme.HTTPS},
        externalDocs = @ExternalDocs(value = "Read This For Sure", url = "http://smatine.com")
)
public interface ApiDocumentationConfig {

}