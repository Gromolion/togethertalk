<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePagination } from "@/primitives/Pagination/hooks";

const props = withDefaults(
  defineProps<{
    perPageMultiplier: number;
    withEdgeButtons: boolean;
    countInEachDirection: number;
    totalCount: number;
  }>(),
  {
    perPageMultiplier: 10,
    withEdgeButtons: true,
    countInEachDirection: 1,
  }
);

const router = useRouter();
const route = useRoute();

const { currentPage, perPage } = usePagination(props.perPageMultiplier);
const lastPage = computed(() => Math.ceil(props.totalCount / perPage.value));

const pagesRange = computed(() => {
  const range = [];

  for (
    let i = currentPage.value - props.countInEachDirection;
    i <= currentPage.value + props.countInEachDirection;
    i++
  ) {
    if (i < 1 || i > lastPage.value) continue;
    range.push(i);
  }

  return range;
});

const handleClick = (page) => {
  router.replace({
    path: route.path,
    query: {
      page: page,
      perPage: perPage.value,
    },
  });
};
</script>

<template>
  <nav v-if="totalCount > perPage" aria-label="Постраничная навигация">
    <ul class="pagination justify-content-center">
      <li
        class="page-item"
        v-if="withEdgeButtons && currentPage !== 1"
        @click="handleClick(currentPage - 1)"
      >
        <span class="page-link" href="#" aria-label="Предыдущая">
          <span aria-hidden="true">&laquo;</span>
        </span>
      </li>
      <li class="page-item" v-if="pagesRange.at(0) > 1" @click="handleClick(1)">
        <span class="page-link">1</span>
      </li>
      <li class="page-item notActive" v-if="pagesRange.at(0) > 2">
        <span class="page-link">...</span>
      </li>
      <li
        class="page-item"
        :class="{ notActive: page === currentPage }"
        v-for="page in pagesRange"
        :key="page"
        @click="handleClick(page)"
      >
        <span class="page-link">{{ page }}</span>
      </li>
      <li class="page-item notActive" v-if="pagesRange.at(-1) < lastPage - 1">
        <span class="page-link">...</span>
      </li>
      <li
        class="page-item"
        v-if="pagesRange.at(-1) < lastPage"
        @click="handleClick(lastPage)"
      >
        <span class="page-link">{{ lastPage }}</span>
      </li>
      <li
        class="page-item"
        v-if="withEdgeButtons && currentPage !== lastPage"
        @click="handleClick(currentPage + 1)"
      >
        <span class="page-link" href="#" aria-label="Следующая">
          <span aria-hidden="true">&raquo;</span>
        </span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.page-link {
  padding: 0.5625rem 1.125rem;
  font-size: 1.2rem;
}
.page-item:not(.notActive) {
  cursor: pointer;
}
.page-item.notActive .page-link {
  color: #5b5b5b;
}
</style>
