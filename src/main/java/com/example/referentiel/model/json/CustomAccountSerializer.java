package com.example.referentiel.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.example.referentiel.model.Account;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class CustomAccountSerializer extends StdSerializer<List<Account>>{
	 
	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomAccountSerializer() {
	        this(null);
	    }
	 
	    public  CustomAccountSerializer(Class<List<Account>> t) {
	        super(t);
	    }
	 
	    @Override
	    public void serialize(
	      List<Account> accounts, 
	      JsonGenerator generator, 
	      SerializerProvider provider) 
	      throws IOException, JsonProcessingException {
	      
	      List<String> ids = new ArrayList<>();
	        for (Account a : accounts) {
	            ids.add(a.getId() + ":" + a.getNumAccount());
	        }
	        generator.writeObject(ids);
	    }
}
