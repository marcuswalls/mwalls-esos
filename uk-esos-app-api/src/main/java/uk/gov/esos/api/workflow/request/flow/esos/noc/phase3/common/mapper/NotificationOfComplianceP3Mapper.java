package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestTaskPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface NotificationOfComplianceP3Mapper {


    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "nocAttachments", ignore = true)
    NotificationOfComplianceP3ApplicationRequestActionPayload toNotificationOfComplianceP3ApplicationRequestActionPayload(
        NotificationOfComplianceP3RequestPayload requestPayload, RequestActionPayloadType payloadType);

    @AfterMapping
    default void setNocAttachments(@MappingTarget NotificationOfComplianceP3ApplicationRequestActionPayload requestActionPayload,
                                   NotificationOfComplianceP3RequestPayload requestPayload) {
        requestActionPayload.setNocAttachments(requestPayload.getNocAttachments());
    }

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "nocAttachments", ignore = true)
    NotificationOfComplianceP3ApplicationRequestActionPayload toNotificationOfComplianceP3ApplicationRequestActionPayload(
            NotificationOfComplianceP3ApplicationRequestTaskPayload taskPayload,
            RequestActionPayloadType payloadType);

    @AfterMapping
    default void setNocAttachments(@MappingTarget NotificationOfComplianceP3ApplicationRequestActionPayload requestActionPayload,
                                   NotificationOfComplianceP3ApplicationRequestTaskPayload taskPayload) {
        requestActionPayload.setNocAttachments(taskPayload.getNocAttachments());
    }
}
