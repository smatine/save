package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.RouteTable;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomRouteTableSerializer extends StdSerializer<List<RouteTable>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomRouteTableSerializer() {
	        this(null);
	    }
	 
	    public  CustomRouteTableSerializer(Class<List<RouteTable>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<RouteTable> routetables, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (RouteTable routeTable : routetables) {
	            ids.add(routeTable.getId() + ":" + routeTable.getName());
	        }
	        generator.writeObject(ids);
	    }
}
