package com.metepg.budget.controller;

import com.metepg.budget.model.User;
import com.metepg.budget.util.SecurityUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public User getCurrentUser() {
        return SecurityUtil.getCurrentUser();
    }
}
