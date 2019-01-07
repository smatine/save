package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Cidr;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomCidrSerializer extends StdSerializer<List<Cidr>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomCidrSerializer() {
	        this(null);
	    }
	 
	    public  CustomCidrSerializer(Class<List<Cidr>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Cidr> cidrs, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Cidr cidr : cidrs) {
	            ids.add(cidr.getId() + ":" + cidr.getCidr());
	        }
	        generator.writeObject(ids);
	    }
}
