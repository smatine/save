package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.AutoScalingGroup;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomAutoScalingGroupSerializer extends StdSerializer<List<AutoScalingGroup>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomAutoScalingGroupSerializer() {
	        this(null);
	    }
	 
	    public  CustomAutoScalingGroupSerializer(Class<List<AutoScalingGroup>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<AutoScalingGroup> autoScalingGroups, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (AutoScalingGroup autoScalingGroup : autoScalingGroups) {
	            ids.add(autoScalingGroup.getId() + ":" + autoScalingGroup.getName());
	        }
	        generator.writeObject(ids);
	    }
}
