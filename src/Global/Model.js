export function getCores () {
  return [
    {
      value: 0,
      scaledValue: 1,
      label: '1'
    },
    {
      value: 1,
      scaledValue: 2,
      label: '2'
    },
    {
      value: 2,
      scaledValue: 4,
      label: '4'
    },
    {
      value: 3,
      scaledValue: 8,
      label: '8'
    },
    {
      value: 4,
      scaledValue: 16,
      label: '16'
    },
    {
      value: 5,
      scaledValue: 32,
      label: '32'
    },
    {
      value: 6,
      scaledValue: 64,
      label: '64'
    },
    {
      value: 7,
      scaledValue: 128,
      label: '128'
    }
  ]
}

export function getArchs () {
  return ['X86_32', 'X86_64', 'ARM_7', 'ARM_8', 'PPC_64', 'S390X']
}

export function getDefaultArchs () {
  return ['X86_32', 'X86_64']
}

export function getCPUInstructionExt () {
  return [
    '3DNow!',
    'ABM',
    'ADX',
    'AES',
    'AMX',
    'AVX',
    'AVX2',
    'AVX-512',
    'BMI1',
    'BMI2',
    'CLMUL',
    'E3DNow!',
    'EMMX',
    'F16C',
    'FMA3',
    'FMA4',
    'FPU',
    'MKTME',
    'MMX',
    'MPX',
    'PMEM',
    'PREFETCH',
    'RdRAND',
    'SEV',
    'SGX',
    'SHA',
    'SME',
    'SMM',
    'SMX',
    'SSE',
    'SSE2',
    'SSE3',
    'SSE4.1',
    'SSE4.2',
    'SSE4a',
    'SSE5',
    'SSSE3',
    'TBM',
    'TME',
    'TSME',
    'TSX',
    'XOP'
  ]
}
