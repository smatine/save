package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.SubnetGroup;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomSubnetGroupSerializer extends StdSerializer<List<SubnetGroup>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomSubnetGroupSerializer() {
	        this(null);
	    }
	 
	    public  CustomSubnetGroupSerializer(Class<List<SubnetGroup>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<SubnetGroup> Subnetgroups, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (SubnetGroup subnetGroup : Subnetgroups) {
	            ids.add(subnetGroup.getId() + ":" + subnetGroup.getName());
	        }
	        generator.writeObject(ids);
	    }
}
