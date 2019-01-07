package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Rds;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomRdsSerializer extends StdSerializer<List<Rds>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomRdsSerializer() {
	        this(null);
	    }
	 
	    public  CustomRdsSerializer(Class<List<Rds>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Rds> rdss, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Rds rds : rdss) {
	            ids.add(rds.getId() + ":" + rds.getName());
	        }
	        generator.writeObject(ids);
	    }
}
