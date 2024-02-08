**Energy Savings Opportunity Scheme**

ESOS is a mandatory energy assessment scheme for organisations in the UK that meet the qualification criteria. Organisations that qualify for ESOS must carry out ESOS assessments every 4 years. These assessments are audits of the energy used by their buildings, industrial processes and transport. The ESOS audit is designed to identify tailored and cost-effective measures to allow participating businesses to save energy and achieve carbon and cost savings. The audit costs are estimated to be significantly outweighed by the savings from implementing the recommendations.

Qualification criteria for ESOS is any UK company (body corporate/ partnership/ unincorporated association carrying on a trade or business, with or without a view to profit) that either: 
- employs 250 or more people, or 
- has an annual turnover in excess of £44m and an annual balance sheet total in excess of £38m 

To comply with ESOS legislation, organisations must submit a Notification of Compliance to the scheme administrator, the Environment Agency, who publish some of the information online to support wider interest and transparency about how organisation are performing with their energy savings.  

This repository contains the code for the digital system that is used to support the ESOS service which supports the recent legislative changes necessitating implementation of new features and content which were not available in the legacy system. This digital service:
- acts as a platform to support upcoming scheme changes which will require participants to publicly disclose information from their ESOS reports and action plans against the ESOS recommendations 
- improves the information and functionality available to scheme administrators and compliance bodies 
- meets the Uk GDS service Standard and is designed to meet the needs of the users from the outset

**Overview of service users**
- ESOS Participants: Large undertakings and their corporate group (Responsible Undertaking)  
- Scheme Administrator
- Lead Assessors (energy auditors) 
- Compliance bodies: (the 5 devolved regulators) 
- Department for Energy Security and Net Zero (DEZNZ) – responsible for the establishment of ESOS and policy /legislative changes 
- Many other public and private sector organisations and individual stakeholders
  
**Transactions**
ESOS participants must submit a single Notification of Compliance (NOC) once every four years. The deadline is the same for all participants, it is not staggered.  

For the current phase of ESOS, Phase 3, it is estimated that there will be approximately 10,000 ESOS participant organisations and so that number of NOCs will be submitted via the service in every 4 year period. 

Notifications can be submitted from the day after the qualification date (i.e. from 1 January in the final compliance year of the 4-year ESOS cycle) up to the compliance deadline, 5th December (this is 5th June 2024 for Phase 3).  

To comply with ESOS, organisations must either: 
- complete an ESOS assessment (which involves calculating their total energy usage and identifying areas of significant energy consumption), or  
- gain ISO 50001 (Energy Management System) certification. 

At the last compliance deadline, 81% of organisations completed an ESOS assessment and 5% were covered by the ISO 50001 Energy Management Certificate. 

To complete an ESOS assessment, a lead assessor is required to either conduct or review the assessment to ensure it meets the requirements of the scheme. Lead assessors can either be external (82% at the last compliance deadline) or internal (2%) to the reporting organisation. Organisations that comply via ISO 50001 do not require a lead assessor. 
 
**Technical Architecture**

The ESOS Service is hosted on AWS platform and the infrastructure is built using Infrastructure as Code (IaC) method. This service uses the same tech stack and the same IaC code as the UK ETS Registry, went to public beta in Jan 2021, and METS, public beta in Jul 2023. 

Below are major components of the ESOS service and the code repos:  
- ESOS Web App  
- ESOS API
- Database
- Identity Manager
- Workflow engine  
- ClamAV  
- ESOS Admin  
- Static pages

Updated Feb 2024
