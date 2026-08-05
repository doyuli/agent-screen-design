<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import 'vue-sonner/style.css'
</script>

<template>
  <TooltipProvider>
    <NuxtPage />
  </TooltipProvider>
  <Toaster position="bottom-left" />
</template>
