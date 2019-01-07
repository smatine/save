package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.ElasticSearch;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomElasticSearchSerializer extends StdSerializer<List<ElasticSearch>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomElasticSearchSerializer() {
	        this(null);
	    }
	 
	    public  CustomElasticSearchSerializer(Class<List<ElasticSearch>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<ElasticSearch> elasticsearchs, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (ElasticSearch elasticSearch : elasticsearchs) {
	            ids.add(elasticSearch.getId() + ":" + elasticSearch.getName());
	        }
	        generator.writeObject(ids);
	    }
}
