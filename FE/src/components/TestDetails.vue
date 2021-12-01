<template>
  <div class="row">
    <div class="col-md-12">
      <h4><i class="fas fa-info-circle"></i>&nbsp;Chi tiết bài kiểm tra</h4>
      <div class="mb-2 col-12"><strong>Tên:</strong> {{ test.name }}</div>
      <div class="mb-2 col-12"><strong>Thời gian:</strong> {{ test.time }} phút</div>
      <div class="mb-2 col-12">
        <strong>Mã bài kiểm tra:</strong> {{ test.id }}
      </div>
      <div class="mb-2 col-12">
        <strong>Hiển thị công khai: </strong>
        <i v-if="test.visible" class="fas fa-check"></i>
        <i v-else class="fas fa-times"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TestDetails",
  props: ["test"],
};
</script>
