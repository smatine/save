package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Dhcp;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomDhcpSerializer extends StdSerializer<List<Dhcp>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomDhcpSerializer() {
	        this(null);
	    }
	 
	    public  CustomDhcpSerializer(Class<List<Dhcp>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Dhcp> dhcps, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Dhcp dhcp : dhcps) {
	            ids.add(dhcp.getId() + ":" + dhcp.getName());
	        }
	        generator.writeObject(ids);
	    }
}
