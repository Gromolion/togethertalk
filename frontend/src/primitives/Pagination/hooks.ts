import { computed } from "vue";
import { useRoute } from "vue-router";

export const usePagination = (defaultPerPage: number = 10) => {
  const route = useRoute();

  const currentPage = computed(() => parseInt(route.query.page) || 1);
  const perPage = computed(
    () => parseInt(route.query.perPage) || defaultPerPage
  );

  return { currentPage, perPage };
};
