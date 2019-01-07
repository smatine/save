package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.EndPoint;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomEndPointSerializer extends StdSerializer<List<EndPoint>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomEndPointSerializer() {
	        this(null);
	    }
	 
	    public  CustomEndPointSerializer(Class<List<EndPoint>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<EndPoint> endPoints, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (EndPoint endPoint : endPoints) {
	            ids.add(endPoint.getId() + ":" + endPoint.getName());
	        }
	        generator.writeObject(ids);
	    }
}
