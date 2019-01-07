package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Ecc;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomEccSerializer extends StdSerializer<List<Ecc>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomEccSerializer() {
	        this(null);
	    }
	 
	    public  CustomEccSerializer(Class<List<Ecc>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Ecc> eccs, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Ecc ecc : eccs) {
	            ids.add(ecc.getId() + ":" + ecc.getName());
	        }
	        generator.writeObject(ids);
	    }
}
