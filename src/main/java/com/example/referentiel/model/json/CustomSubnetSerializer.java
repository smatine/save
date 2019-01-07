package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Subnet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomSubnetSerializer extends StdSerializer<List<Subnet>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomSubnetSerializer() {
	        this(null);
	    }
	 
	    public  CustomSubnetSerializer(Class<List<Subnet>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Subnet> subnets, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Subnet a : subnets) {
	            ids.add(a.getId() + ":" + a.getName());
	        }
	        generator.writeObject(ids);
	    }
}
