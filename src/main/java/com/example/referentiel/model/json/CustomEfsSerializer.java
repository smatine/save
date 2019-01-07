package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Efs;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomEfsSerializer extends StdSerializer<List<Efs>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomEfsSerializer() {
	        this(null);
	    }
	 
	    public  CustomEfsSerializer(Class<List<Efs>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Efs> efss, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Efs efs : efss) {
	            ids.add(efs.getId() + ":" + efs.getName());
	        }
	        generator.writeObject(ids);
	    }
}
