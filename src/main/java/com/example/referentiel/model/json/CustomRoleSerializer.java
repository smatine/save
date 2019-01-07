package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Role;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomRoleSerializer extends StdSerializer<List<Role>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomRoleSerializer() {
	        this(null);
	    }
	 
	    public  CustomRoleSerializer(Class<List<Role>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Role> roles, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Role role : roles) {
	            ids.add(role.getId() + ":" + role.getName());
	        }
	        generator.writeObject(ids);
	    }
}
