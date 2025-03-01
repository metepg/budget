package com.metepg.budget.service;

import com.metepg.budget.dto.MonthlyRecordResponseDTO;
import com.metepg.budget.dto.UserResponseDTO;
import com.metepg.budget.model.User;
import com.metepg.budget.repository.MonthlyRecordRepository;
import com.metepg.budget.repository.UserRepositoryJPA;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepositoryJPA userRepositoryJPA;
    private final MonthlyRecordRepository monthlyRecordRepository;

    public Optional<UserResponseDTO> getCurrentUser(org.springframework.security.core.userdetails.UserDetails  userDetails) {
        if (userDetails == null) {
            return Optional.empty();
        }

        Optional<User> user = userRepositoryJPA.findByUsername(userDetails.getUsername());

        return user.map(u -> new UserResponseDTO(
                u.getUsername(),
                monthlyRecordRepository.findLatestByUsername(u.getUsername())
                        .map(MonthlyRecordResponseDTO::new)
                        .orElse(null),
                u.isEnabled()
        ));
    }

}
