<script setup lang="ts">
import { TypographyElements } from "@/primitives/Typography/enum";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import FilterModel from "@/storage/modules/report/FilterModel";
import InputField from "@/primitives/Input/InputField.vue";
import { AutocompleteTypes } from "@/enums/autocompleteTypes";
import AutocompleteField from "@/primitives/Input/AutocompleteField.vue";
import { ref } from "vue";
import moment from "moment-timezone";
import MeetingCard from "@/components/Main/MeetingCard.vue";
import { MeetGateway } from "@/services/api/gateway/meet.gateway";
import { ToastsTypes } from "@/enums/toastsTypes";
import { useStore } from "vuex";
import { saveFileToUser } from "@/utils/file";

const store = useStore();

const model = new FilterModel();
const users = ref([]);

const list = ref([]);
const loading = ref(false);

const handleReport = async () => {
  loading.value = true;

  model.page = 1;
  model.perPage = 10;
  model.users = users.value.map((user) => user.id);
  try {
    list.value = await MeetGateway.report(model);
    loading.value = false;
  } catch (e) {
    loading.value = false;

    await store.dispatch("toast/new", {
      title: "Произошла ошибка",
      message: e.message,
      type: ToastsTypes.ERROR,
    });
  }
};

const handleReportDownload = async () => {
  loading.value = true;

  model.page = 1;
  model.perPage = 10;
  model.users = users.value.map((user) => user.id);
  try {
    saveFileToUser("report.xlsx", await MeetGateway.reportDownload(model));
    loading.value = false;
  } catch (e) {
    loading.value = false;

    await store.dispatch("toast/new", {
      title: "Произошла ошибка",
      message: e.message,
      type: ToastsTypes.ERROR,
    });
  }
};

const onCancel = (id) => {
  list.value = list.value.filter((meet) => meet.id !== id);
};
const onChange = (source) => {
  const target = list.value.find((meet) => meet.id === source.id);
  Object.assign(target, source);
};

const handleSelectUser = (item) => users.value.push(item);
</script>

<template>
  <div class="container p-4">
    <TypographyText
      class="header"
      :element="TypographyElements.H4"
      color="#000206"
    >
      Отчет
    </TypographyText>
    <div class="filters">
      <TypographyText :element="TypographyElements.H6" class="mb-3">
        За период:
      </TypographyText>
      <div class="mb-2 d-flex gap-4 range">
        <div class="form-floating">
          <InputField
            id="dateFromInput"
            v-model="model.dateFrom"
            class-name="form-control"
            placeholder="Начало"
            label="Начало"
            type="datetime-local"
          />
        </div>
        <div class="form-floating">
          <InputField
            id="dateToInput"
            v-model="model.dateTo"
            class-name="form-control"
            placeholder="Конец"
            label="Конец"
            type="datetime-local"
          />
        </div>
      </div>
      <TypographyText :element="TypographyElements.H6" class="mb-2">
        По участникам:
      </TypographyText>
      <div class="row align-items-center mb-3">
        <div class="participant col-3" v-for="user in users" :key="user.id">
          <TypographyText
            class="mb-1 d-flex align-items-center gap-1 participantName"
            :element="TypographyElements.P"
          >
            <i class="bi bi-person" /> {{ user.value }}
            <i
              class="bi bi-x px-1"
              @click="users = users.filter((item) => item.id !== user.id)"
            />
          </TypographyText>
        </div>
        <AutocompleteField
          class="autocomplete col-3"
          id="userAutocomplete"
          label="Добавить"
          placeholder="Добавить..."
          :excludeIds="users.map((item) => item.id)"
          :type="AutocompleteTypes.USER"
          @selectItem="handleSelectUser"
        />
      </div>
    </div>
    <div class="d-flex gap-4 mb-4">
      <button
        class="btn btn-outline-secondary px-3 py-2 w-25"
        :disabled="loading"
        @click="handleReport"
      >
        Сформировать
      </button>
      <button
        class="btn btn-outline-secondary px-3 py-2 w-25"
        :disabled="loading"
        @click="handleReportDownload"
      >
        Выгрузить
      </button>
    </div>
    <div class="list d-flex flex-wrap">
      <div
        class="meetingCard"
        v-for="meet in list.sort(
          (meet1, meet2) =>
            moment(meet1.meetAt).unix() - moment(meet2.meetAt).unix()
        )"
        :key="meet.id"
      >
        <MeetingCard
          :meet="meet"
          @cancel="onCancel"
          @change="onChange"
          withFullDate
        />
      </div>
    </div>
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

.bi-x {
  font-size: 1.3rem;
  cursor: pointer;
  border-radius: 50px;
}
.bi-x:hover {
  background-color: #eaeaea;
}

.range .form-floating {
  width: 25%;
}

.list {
  justify-content: safe start;
}

.meetingCard {
  width: 24%;
  margin: 0 0.5% 10px;
}
</style>
