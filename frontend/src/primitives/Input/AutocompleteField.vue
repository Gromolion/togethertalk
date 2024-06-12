<script setup lang="ts">
import { ref, watch } from "vue";
import InputField from "@/primitives/Input/InputField.vue";
import { AutocompleteTypes } from "@/enums/autocompleteTypes";
import { InfoGateway } from "@/services/api/gateway/info.gateway";

const props = defineProps<{
  className?: string;
  id: string;
  placeholder?: string;
  label?: string;
  type: AutocompleteTypes;
  excludeIds?: number[];
}>();

const emit = defineEmits(["selectItem"]);

const model = ref("");
const items = ref([]);

watch(model, async (input: string) => {
  if (input.length < 3) {
    items.value = [];
    return;
  }

  items.value = (await InfoGateway.autocomplete(input, props.type)).filter(
    (item) => !(props.excludeIds ?? []).includes(item.id)
  );
});

const handleSelect = (item) => {
  emit("selectItem", item.id);
  model.value = "";
};
</script>

<template>
  <div :class="className">
    <div class="form-floating">
      <InputField
        :id="id"
        className="form-control"
        :placeholder="placeholder"
        :label="label"
        v-model="model"
      />
      <div class="items w-100" v-if="items.length">
        <div
          v-for="item in items"
          :key="item.id"
          class="item px-3 py-2"
          @click="handleSelect(item)"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.items {
  position: absolute;
  top: 55px;
  border: 1px solid #dee2e6;
  border-top: none;
  background-color: #ffffff;
  border-radius: 0 0 15px 15px;
}
.item:hover {
  cursor: pointer;
  background-color: #ececec;
}

.item:last-of-type:hover {
  border-radius: 0 0 15px 15px;
}
</style>
