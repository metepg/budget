package com.metepg.budget.service;

import com.metepg.budget.dto.BillResponseDTO;
import com.metepg.budget.dto.UserResponseDTO;
import com.metepg.budget.model.User;
import com.metepg.budget.repository.BillRepository;
import com.metepg.budget.repository.UserRepositoryJPA;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepositoryJPA userRepositoryJPA;
    private final BillRepository billRepository;

    public Optional<UserResponseDTO> getCurrentUser(org.springframework.security.core.userdetails.UserDetails  userDetails) {
        if (userDetails == null) {
            return Optional.empty();
        }

        Optional<User> user = userRepositoryJPA.findByUsername(userDetails.getUsername());

        return user.map(u -> new UserResponseDTO(
                u.getUsername(),
                billRepository.findLatestByUsername(u.getUsername())
                        .map(BillResponseDTO::new)
                        .orElse(null),
                u.isEnabled()
        ));
    }

}
