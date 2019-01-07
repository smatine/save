package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Vpc;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomVpcSerializer extends StdSerializer<List<Vpc>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomVpcSerializer() {
	        this(null);
	    }
	 
	    public  CustomVpcSerializer(Class<List<Vpc>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Vpc> vpcs, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Vpc a : vpcs) {
	            ids.add(a.getId() + ":" + a.getName());
	        }
	        generator.writeObject(ids);
	    }
}
