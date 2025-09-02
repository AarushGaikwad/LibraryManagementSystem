package com.example.LibraryManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceInfoDto {
    
    private String deviceId;
    private String deviceType;
    private String ipAddress;
    private String userAgent;
}
