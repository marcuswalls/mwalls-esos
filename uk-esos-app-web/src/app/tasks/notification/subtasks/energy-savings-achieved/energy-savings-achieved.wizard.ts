import { EnergySavingsAchieved } from 'esos-api';

import { ReportingObligationCategory } from '../../../../requests/common/reporting-obligation-category.types';

export const isWizardCompleted = (
  energySavingsAchieved: EnergySavingsAchieved,
  reportingObligationCategory?: ReportingObligationCategory,
): boolean => {
  if (reportingObligationCategory === 'ISO_50001_COVERING_ENERGY_USAGE') {
    const totalEstimation = energySavingsAchieved?.totalEnergySavingsEstimation >= 0 ?? false;

    const recommendationsExist = energySavingsAchieved?.energySavingsRecommendationsExist;
    const recommendations = !!energySavingsAchieved?.energySavingsRecommendations;

    return totalEstimation && ((recommendationsExist && recommendations) || recommendationsExist === false);
  } else {
    const estimation = !!energySavingsAchieved?.energySavingsEstimation;

    const categoriesExist = energySavingsAchieved?.energySavingCategoriesExist;
    const categories = !!energySavingsAchieved?.energySavingsCategories;

    const recommendationsExist = energySavingsAchieved?.energySavingsRecommendationsExist;
    const recommendations = !!energySavingsAchieved?.energySavingsRecommendations;

    const equalTotals =
      energySavingsAchieved?.energySavingsEstimation?.total === energySavingsAchieved?.energySavingsCategories?.total;

    return (
      estimation &&
      ((categoriesExist && categories && equalTotals) || categoriesExist === false) &&
      ((recommendationsExist && recommendations) || recommendationsExist === false)
    );
  }
};
