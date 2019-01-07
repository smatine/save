package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.LaunchConfiguration;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomLaunchConfigurationSerializer extends StdSerializer<List<LaunchConfiguration>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomLaunchConfigurationSerializer() {
	        this(null);
	    }
	 
	    public  CustomLaunchConfigurationSerializer(Class<List<LaunchConfiguration>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<LaunchConfiguration> launchConfigurations, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (LaunchConfiguration launchConfiguration : launchConfigurations) {
	            ids.add(launchConfiguration.getId() + ":" + launchConfiguration.getName());
	        }
	        generator.writeObject(ids);
	    }
}
