package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Group;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomGroupSerializer extends StdSerializer<List<Group>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomGroupSerializer() {
	        this(null);
	    }
	 
	    public  CustomGroupSerializer(Class<List<Group>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Group> groups, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Group group : groups) {
	            ids.add(group.getId() + ":" + group.getName());
	        }
	        generator.writeObject(ids);
	    }
}
