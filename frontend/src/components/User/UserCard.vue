<script setup lang="ts">
import UserDetailed from "@/components/User/UserDetailed.vue";
import { UserInterface } from "@/services/api/decoders/user/userDecoder";
import { ref } from "vue";
import { createBase64Image } from "@/utils/image";

defineProps<{
  user: UserInterface;
}>();

const detailModalOpened = ref(false);
</script>

<template>
  <div class="userCard p-2" @click="detailModalOpened = true">
    <img
      v-if="user.avatar"
      :src="createBase64Image(user.avatar)"
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
  <UserDetailed
    v-if="detailModalOpened"
    :user="user"
    @close="detailModalOpened = false"
  />
</template>

<style scoped>
.userCard {
  width: 19%;
  margin: 0 0.5%;
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
}

.userCard:hover {
  cursor: pointer;
  background-color: #ececec;
}

.userCard:hover .cardImage {
  filter: brightness(80%);
}

.cardImage {
  border-radius: 10px;
  width: 100%;
  aspect-ratio: 1 / 1;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
}

.noAvatar {
  background-color: #e0dfdf;
}

.noAvatar i {
  font-size: 4rem;
}
</style>
