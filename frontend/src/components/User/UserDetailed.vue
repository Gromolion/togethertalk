<script setup lang="ts">
import BaseModal from "@/primitives/BaseModal.vue";
import { UserInterface } from "@/services/api/decoders/user/userDecoder";
import { TypographyElements } from "@/primitives/Typography/enum";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { RoleProvider } from "@/utils/role";
import { computed, ref } from "vue";
import UserGateway from "@/services/api/gateway/user.gateway";
import { ToastsTypes } from "@/enums/toastsTypes";
import UserCreateModal from "@/components/User/UserCreateModal.vue";
import UserModel from "@/storage/modules/user/UserModel";
import AppRoutes from "@/storage/appState/appRoutes";
import InputField from "@/primitives/Input/InputField.vue";
import { prepareFileUploader } from "@/utils/request/prepareFileUploader";
import { createBase64Image } from "@/utils/image";

const props = defineProps<{
  user: UserInterface;
}>();
defineEmits(["close"]);

const store = useStore();
const router = useRouter();

const currentUser = computed(() => store.state.auth.user);

const loading = ref(false);
const updateModalOpened = ref(false);

const userModel = UserModel.fromUser(props.user);

const avatarInput = ref(null);

const handleRemove = async () => {
  try {
    loading.value = true;

    await UserGateway.remove(props.user.id);

    await router.push({ path: AppRoutes.getUsersUrl() });
    router.go();
  } catch (e) {
    loading.value = false;

    await store.dispatch("toast/new", {
      title: "Произошла ошибка",
      message: e.message,
      type: ToastsTypes.ERROR,
    });
  }
};

const handleAvatarSet = () => {
  avatarInput.value.$el.nextSibling.click();

  avatarInput.value.$el.nextSibling.onchange = async (e) => {
    const file = e.target.files[0];

    if (file.size >= 3145728) {
      await store.dispatch("toast/new", {
        message: "Вес изображения не должен превышать 3 Mb",
        type: ToastsTypes.ERROR,
      });

      return;
    }

    const form = new FormData();
    form.append("avatar", file, file.name);

    try {
      const { runUpload } = await prepareFileUploader(() =>
        UserGateway.setAvatar(props.user.id)
      );
      await runUpload(form);

      await router.push({ path: AppRoutes.getUsersUrl() });
      router.go();
    } catch (e) {
      await store.dispatch("toast/new", {
        title: "Произошла ошибка",
        message: e.message,
        type: ToastsTypes.ERROR,
      });
    }
  };
};

const handleRemoveAvatar = async () => {
  try {
    await UserGateway.removeAvatar(props.user.id);

    await router.push({ path: AppRoutes.getUsersUrl() });
    router.go();
  } catch (e) {
    await store.dispatch("toast/new", {
      title: "Произошла ошибка",
      message: e.message,
      type: ToastsTypes.ERROR,
    });
  }
};
</script>

<template>
  <BaseModal @close="$emit('close')">
    <div class="position-relative d-flex">
      <div class="info">
        <TypographyText class="mb-3" :element="TypographyElements.H5">
          {{ user.firstName + " " + user.lastName }}
        </TypographyText>
        <TypographyText class="mb-3" :element="TypographyElements.P">
          Логин: {{ user.login }}
        </TypographyText>
        <TypographyText class="mb-3" :element="TypographyElements.P">
          Почта: {{ user.email }}
        </TypographyText>
        <TypographyText
          v-if="user.position"
          class="mb-3"
          :element="TypographyElements.P"
        >
          Должность: {{ user.position }}
        </TypographyText>
        <TypographyText class="mb-3" :element="TypographyElements.P">
          Роли: {{ RoleProvider.representation(user) }}
        </TypographyText>
      </div>
      <div class="avatar position-relative d-flex flex-column">
        <button
          class="removeAvatarBtn position-absolute"
          @click="handleRemoveAvatar"
        >
          <i class="bi bi-x" />
        </button>
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
        <button
          class="changeAvatarBtn position-absolute"
          @click="handleAvatarSet"
        >
          <i class="bi bi-plus" />
          <InputField
            ref="avatarInput"
            id="avatarInput"
            type="file"
            className="visually-hidden"
            accept=".png,.jpg,.jpeg,.gif,.webp"
          />
        </button>
      </div>
    </div>
    <div class="d-flex justify-content-between gap-4">
      <button
        type="button"
        class="btn btn-outline-secondary px-4 py-2"
        @click="updateModalOpened = true"
      >
        Редактировать
      </button>
      <button
        v-if="RoleProvider.isAdmin(currentUser)"
        type="button"
        class="btn btn-outline-secondary px-4 py-2"
        @click="handleRemove"
      >
        Удалить
      </button>
    </div>
    <UserCreateModal
      v-if="updateModalOpened"
      v-model="userModel"
      @close="updateModalOpened = false"
    />
  </BaseModal>
</template>

<style scoped>
.info {
  margin-right: 50px;
}

.avatar {
  border-radius: 15px;
}

.cardImage {
  border-radius: 15px;
  width: 160px;
  height: 160px;
}

.avatar:hover {
  filter: brightness(80%);
}

.noAvatar {
  background-color: #e0dfdf;
}

.noAvatar i {
  font-size: 4rem;
}

.removeAvatarBtn {
  background: none;
  right: 0;
  border: none;
  border-radius: 0 15px 0;
}

.changeAvatarBtn {
  width: 100%;
  bottom: 38px;
  background: none;
  border: none;
  border-radius: 0 0 15px 15px;
}

.changeAvatarBtn:hover,
.removeAvatarBtn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.changeAvatarBtn i,
.removeAvatarBtn i {
  color: #fff;
  font-size: 1.5rem;
}
</style>
