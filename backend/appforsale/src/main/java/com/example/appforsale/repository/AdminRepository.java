// package com.example.appforsale.repository;

// import org.springframework.data.jpa.repository.JpaRepository;

// import com.example.appforsale.entity.Admin;

// public interface AdminRepository extends JpaRepository<Admin, Long> {
//     boolean existsByEmail(String email);
// }

package com.example.appforsale.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.example.appforsale.entity.Admin;

import java.util.Optional;

// public interface AdminRepository extends JpaRepository<Admin, Long> {
//     Optional<Admin> findByEmail(String email);
// }
public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByEmail(String email);
    Optional<Admin> findByEmail(String email);
}