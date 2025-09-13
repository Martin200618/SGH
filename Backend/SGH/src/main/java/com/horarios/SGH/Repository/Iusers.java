    package com.horarios.SGH.Repository;

    import java.util.Optional;
    import org.springframework.data.jpa.repository.JpaRepository;
    import com.horarios.SGH.Model.users;

    public interface Iusers extends JpaRepository<users, Integer> {
        Optional<users> findByUserName(String userName);
        boolean existsByUserName(String userName);
        long count();
    }
