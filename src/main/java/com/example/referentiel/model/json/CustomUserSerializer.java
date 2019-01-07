package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.User;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomUserSerializer extends StdSerializer<List<User>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomUserSerializer() {
	        this(null);
	    }
	 
	    public  CustomUserSerializer(Class<List<User>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<User> users, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (User user : users) {
	            ids.add(user.getId() + ":" + user.getName());
	        }
	        generator.writeObject(ids);
	    }
}
