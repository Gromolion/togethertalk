<script setup lang="ts">
import { TypographyElements } from "@/primitives/Typography/enum";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { computed, Ref, ref, watch } from "vue";
import UserGateway from "@/services/api/gateway/user.gateway";
import { UserInterface } from "@/services/api/decoders/user/userDecoder";
import UserCreateModal from "@/components/User/UserCreateModal.vue";
import UserCard from "@/components/User/UserCard.vue";
import PaginationBar from "@/primitives/Pagination/PaginationBar.vue";
import { usePagination } from "@/primitives/Pagination/hooks";

const list: Ref<UserInterface[]> = ref([]);
const totalCount = ref(0);

const pagination = computed(() => usePagination(10));

watch(
  pagination,
  ({ currentPage, perPage }) => {
    UserGateway.list(currentPage.value, perPage.value).then((res) => {
      list.value = res.users;
      totalCount.value = res.totalCount;
    });
  },
  { immediate: true, deep: true }
);

const createModalOpened = ref(false);
</script>

<template>
  <div class="container p-4">
    <TypographyText
      class="header"
      :element="TypographyElements.H4"
      color="#000206"
    >
      Сотрудники
    </TypographyText>
    <div class="d-flex justify-content-end mb-3">
      <button
        class="btn btn-outline-secondary px-4 py-2"
        @click="createModalOpened = true"
      >
        Создать
      </button>
    </div>
    <div class="row list mb-3">
      <UserCard v-for="user in list" :key="user.id" :user="user" />
    </div>
    <PaginationBar :totalCount="totalCount" :perPageMultiplier="10" />
    <UserCreateModal
      v-if="createModalOpened"
      @close="createModalOpened = false"
    />
  </div>
</template>

<style scoped>
.container {
  margin-top: 50px;
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
}

.header {
  position: relative;
  bottom: 25px;
  left: 15px;
  margin: -15px !important;
  background-color: #fff;
  width: fit-content;
}
</style>
