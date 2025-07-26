package com.example.backend.Repository;

import com.example.backend.Model.SignupModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SignupRepository extends MongoRepository<SignupModel, String> {

    // ✅ Custom Query Method using field name (emailId)
    SignupModel findByEmailId(String emailId);
}
