<script setup lang="ts">
import { TypographyElements } from "@/primitives/Typography/enum";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { Ref, ref, UnwrapRef } from "vue";
import UserGateway from "@/services/api/gateway/user.gateway";
import { UserInterface } from "@/services/api/decoders/user/userDecoder";
import UserCreateModal from "@/components/User/UserCreateModal.vue";

const list: Ref<UserInterface[]> = ref([]);
const totalCount = ref(0);

UserGateway.list(1, 10).then((res) => {
  list.value = res.users;
  totalCount.value = res.totalCount;
});

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
    <div class="d-flex justify-content-end">
      <button
        class="btn btn-outline-secondary px-4 py-2"
        @click="createModalOpened = true"
      >
        Создать
      </button>
    </div>
    <div class="row list">
      <div class="card p-2" v-for="user in list" :key="user.id">
        <img
          v-if="user.avatar"
          :src="'data:image/png;base64, ' + user.avatar"
          alt="Фото профиля"
          class="cardImage"
        />
        <div
          v-else
          class="noAvatar cardImage d-flex justify-content-center align-items-center"
        >
          <i class="bi bi-person" />
        </div>
        <div class="card-title mb-0 mt-1 text-center fs-5">
          {{ user.firstName + " " + user.lastName }}
        </div>
      </div>
    </div>
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

.card {
  width: 19%;
  margin: 0 0.5%;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
}

.card:hover {
  cursor: pointer;
  background-color: #ececec;
}

.card:hover .cardImage {
  filter: brightness(80%);
}

.cardImage {
  border-radius: 5px;
  width: 190px;
  height: 190px;
}

.noAvatar {
  background-color: #f3f3f3;
}

.noAvatar i {
  font-size: 4rem;
}
</style>
