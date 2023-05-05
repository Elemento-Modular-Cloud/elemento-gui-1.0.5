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

export function getOverprovision () {
  return [
    {
      value: 0,
      label: '1'
    },
    {
      value: 1,
      label: '2'
    },
    {
      value: 2,
      label: '3'
    },
    {
      value: 3,
      label: '4'
    },
    {
      value: 4,
      label: '5'
    },
    {
      value: 5,
      label: '6'
    },
    {
      value: 6,
      label: '7'
    },
    {
      value: 7,
      label: '8'
    }
  ]
}

export function getMemories () {
  return [
    {
      value: 0,
      label: '250MB',
      amount: 256
    },
    {
      value: 1,
      label: '500MB',
      amount: 512
    },
    {
      value: 2,
      label: '1GB',
      amount: 1024
    },
    {
      value: 3,
      label: '2GB',
      amount: 2048
    },
    {
      value: 4,
      label: '4GB',
      amount: 4096
    },
    {
      value: 5,
      label: '8GB',
      amount: 8192
    },
    {
      value: 6,
      label: '16GB',
      amount: 16384
    },
    {
      value: 7,
      label: '32GB',
      amount: 32768
    },
    {
      value: 8,
      label: '64GB',
      amount: 65536
    },
    {
      value: 9,
      label: '128GB',
      amount: 131072
    },
    {
      value: 10,
      label: '256GB',
      amount: 262144
    },
    {
      value: 11,
      label: '512GB',
      amount: 524288
    },
    {
      value: 12,
      label: '1TB',
      amount: 1048576
    }
  ]
}

export function getArchs () {
  return ['X86_32', 'X86_64']
  // return ['X86_32', 'X86_64', 'ARM_7', 'ARM_8', 'PPC_64', 'S390X']
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

export const models = require('../Data/models.json')
export const vendors = require('../Data/vendors.json')
