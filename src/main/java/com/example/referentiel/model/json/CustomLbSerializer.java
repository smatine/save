package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Lb;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomLbSerializer extends StdSerializer<List<Lb>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomLbSerializer() {
	        this(null);
	    }
	 
	    public  CustomLbSerializer(Class<List<Lb>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Lb> lbs, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Lb lb : lbs) {
	            ids.add(lb.getId() + ":" + lb.getName());
	        }
	        generator.writeObject(ids);
	    }
}
