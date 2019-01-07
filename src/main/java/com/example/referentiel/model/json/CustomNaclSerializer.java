package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Nacl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomNaclSerializer extends StdSerializer<List<Nacl>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomNaclSerializer() {
	        this(null);
	    }
	 
	    public  CustomNaclSerializer(Class<List<Nacl>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Nacl> nacls, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Nacl nacl : nacls) {
	            ids.add(nacl.getId() + ":" + nacl.getName());
	        }
	        generator.writeObject(ids);
	    }
}
