package uk.gov.esos.api.web.controller.workflow;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.workflow.request.application.requestaction.RequestActionQueryService;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestActionInfoDTO;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class RequestActionControllerTest {
    
    private static final String BASE_PATH = "/v1.0/request-actions";

    private MockMvc mockMvc;

    @InjectMocks
    private RequestActionController controller;
    
    @Mock
    private AppSecurityComponent appSecurityComponent;
    
    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;
    
    @Mock
    private RequestActionQueryService requestActionQueryService;
    
    @BeforeEach
    void setUp() {
        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        controller = (RequestActionController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setControllerAdvice(new ExceptionControllerAdvice())
                .build();
    }

    @Test
    void getRequestActionById() throws Exception {
        AppUser user = AppUser.builder().userId("user").build();
        Long requestActionId = 1L;
        RequestActionDTO requestActionDTO = RequestActionDTO.builder().id(requestActionId)
                .submitter("fn ln").build();
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(requestActionQueryService.getRequestActionById(requestActionId, user)).thenReturn(requestActionDTO);
        mockMvc.perform(
                    MockMvcRequestBuilders.get(BASE_PATH + "/" + requestActionId)
                                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(requestActionId))
                .andExpect(jsonPath("$.submitter").value("fn ln"));
        
        verify(requestActionQueryService, times(1)).getRequestActionById(requestActionId, user);
    }
    
    @Test
    void getRequestActionById_forbidden() throws Exception {
        AppUser user = AppUser.builder().userId("user").build();
        Long requestActionId = 1L;

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(appUserAuthorizationService)
                .authorize(user, "getRequestActionById", String.valueOf(requestActionId));

        mockMvc.perform(
                    MockMvcRequestBuilders.get(BASE_PATH + "/" + requestActionId)
                                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(requestActionQueryService, never()).getRequestActionById(anyLong(), any());
    }

    @Test
    void getRequestActionsByRequestId() throws Exception {
        AppUser pmrvUser = AppUser.builder().userId("id").build();

        RequestActionInfoDTO requestActionInfoDTO = RequestActionInfoDTO.builder().id(1L).build();
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        when(requestActionQueryService.getRequestActionsByRequestId("2", pmrvUser)).thenReturn(List.of(requestActionInfoDTO));

        mockMvc.perform(MockMvcRequestBuilders
                .get(BASE_PATH)
                .queryParam("requestId", String.valueOf(2))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void getRequestActionsByRequestId_forbidden() throws Exception {
        AppUser pmrvUser = AppUser.builder().userId("id").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(appUserAuthorizationService)
                .authorize(pmrvUser, "getRequestActionsByRequestId", "2");

        mockMvc.perform(MockMvcRequestBuilders
                .get(BASE_PATH)
                .queryParam("requestId", String.valueOf(2))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(requestActionQueryService, never()).getRequestActionsByRequestId(anyString(), any());
    }
}
