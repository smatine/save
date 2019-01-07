package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.ElasticCache;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomElasticCacheSerializer extends StdSerializer<List<ElasticCache>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomElasticCacheSerializer() {
	        this(null);
	    }
	 
	    public  CustomElasticCacheSerializer(Class<List<ElasticCache>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<ElasticCache> Elasticcaches, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (ElasticCache elasticCache : Elasticcaches) {
	            ids.add(elasticCache.getId() + ":" + elasticCache.getName());
	        }
	        generator.writeObject(ids);
	    }
}
