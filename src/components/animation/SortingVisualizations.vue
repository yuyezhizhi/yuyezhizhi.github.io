<template>
  <div class="sorting-visualizations">
    <h2 class="section-title">排序算法可视化</h2>
    <div class="controls-panel">
      <div class="control-group">
        <label for="algorithm-select">选择算法：</label>
        <select id="algorithm-select" v-model="selectedAlgorithm" @change="resetArray">
          <option value="bubble">冒泡排序</option>
          <option value="selection">选择排序</option>
          <option value="insertion">插入排序</option>
          <option value="merge">归并排序</option>
          <option value="quick">快速排序</option>
          <option value="heap">堆排序</option>
          <option value="shell">希尔排序</option>
          <option value="counting">计数排序</option>
          <option value="radix">基数排序</option>
          <option value="bucket">桶排序</option>
        </select>
      </div>
      <div class="control-group">
        <label for="array-size">数组大小：</label>
        <input 
          id="array-size" 
          type="range" 
          min="5" 
          max="100" 
          v-model.number="arraySize" 
          @change="resetArray"
        />
        <span>{{ arraySize }}</span>
      </div>
      <div class="control-group">
        <label for="speed-control">速度：</label>
        <input 
          id="speed-control" 
          type="range" 
          min="5" 
          max="200" 
          v-model.number="delay"
        />
        <span>{{ delay }}ms</span>
      </div>
      <div class="buttons-group">
        <button class="control-btn start-btn" @click="startSorting" :disabled="sorting">开始</button>
        <button class="control-btn reset-btn" @click="resetArray" :disabled="sorting">重置</button>
      </div>
    </div>
    <div class="visualization-area">
      <div 
        v-for="(value, index) in array" 
        :key="index"
        class="bar"
        :class="getBarClass(index)"
        :style="{
          height: `${value / maxValue * 100}%`,
          backgroundColor: getBarColor(index)
        }"
      >
        <span class="bar-value">{{ arraySize <= 30 ? value : '' }}</span>
      </div>
    </div>
    <div class="algorithm-info">
      <h3>{{ algorithmInfo[selectedAlgorithm].name }}</h3>
      <p class="description">{{ algorithmInfo[selectedAlgorithm].description }}</p>
      <div class="complexity">
        <div class="complexity-item">
          <strong>时间复杂度 (平均):</strong> {{ algorithmInfo[selectedAlgorithm].timeComplexity.avg }}
        </div>
        <div class="complexity-item">
          <strong>时间复杂度 (最好):</strong> {{ algorithmInfo[selectedAlgorithm].timeComplexity.best }}
        </div>
        <div class="complexity-item">
          <strong>时间复杂度 (最坏):</strong> {{ algorithmInfo[selectedAlgorithm].timeComplexity.worst }}
        </div>
        <div class="complexity-item">
          <strong>空间复杂度:</strong> {{ algorithmInfo[selectedAlgorithm].spaceComplexity }}
        </div>
        <div class="complexity-item">
          <strong>稳定性:</strong> {{ algorithmInfo[selectedAlgorithm].stable ? '稳定' : '不稳定' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SortingVisualizations',
  data() {
    return {
      array: [],
      arraySize: 50,
      maxValue: 100,
      selectedAlgorithm: 'bubble',
      delay: 50,
      sorting: false,
      comparing: [],
      sorted: [],
      algorithmInfo: {
        bubble: {
          name: '冒泡排序',
          description: '重复地走访过要排序的元素列，依次比较两个相邻的元素，如果顺序错误就把他们交换过来。',
          timeComplexity: { avg: 'O(n²)', best: 'O(n)', worst: 'O(n²)' },
          spaceComplexity: 'O(1)',
          stable: true
        },
        selection: {
          name: '选择排序',
          description: '首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。',
          timeComplexity: { avg: 'O(n²)', best: 'O(n²)', worst: 'O(n²)' },
          spaceComplexity: 'O(1)',
          stable: false
        },
        insertion: {
          name: '插入排序',
          description: '通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。',
          timeComplexity: { avg: 'O(n²)', best: 'O(n)', worst: 'O(n²)' },
          spaceComplexity: 'O(1)',
          stable: true
        },
        merge: {
          name: '归并排序',
          description: '将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。',
          timeComplexity: { avg: 'O(n log n)', best: 'O(n log n)', worst: 'O(n log n)' },
          spaceComplexity: 'O(n)',
          stable: true
        },
        quick: {
          name: '快速排序',
          description: '选择一个基准元素，通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序。',
          timeComplexity: { avg: 'O(n log n)', best: 'O(n log n)', worst: 'O(n²)' },
          spaceComplexity: 'O(log n)',
          stable: false
        },
        heap: {
          name: '堆排序',
          description: '利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。',
          timeComplexity: { avg: 'O(n log n)', best: 'O(n log n)', worst: 'O(n log n)' },
          spaceComplexity: 'O(1)',
          stable: false
        },
        shell: {
          name: '希尔排序',
          description: '把记录按下标的一定增量分组，对每组使用直接插入排序算法排序；随着增量逐渐减少，每组包含的关键词越来越多，当增量减至1时，整个文件恰被分成一组，算法便终止。',
          timeComplexity: { avg: 'O(n^(1.3))', best: 'O(n)', worst: 'O(n²)' },
          spaceComplexity: 'O(1)',
          stable: false
        },
        counting: {
          name: '计数排序',
          description: '一种非比较排序算法。它的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。',
          timeComplexity: { avg: 'O(n+k)', best: 'O(n+k)', worst: 'O(n+k)' },
          spaceComplexity: 'O(n+k)',
          stable: true
        },
        radix: {
          name: '基数排序',
          description: '按照低位先排序，然后收集；再按照高位排序，然后再收集；依次类推，直到最高位。有时候有些属性是有优先级顺序的，先按低优先级排序，再按高优先级排序。',
          timeComplexity: { avg: 'O(n*k)', best: 'O(n*k)', worst: 'O(n*k)' },
          spaceComplexity: 'O(n+k)',
          stable: true
        },
        bucket: {
          name: '桶排序',
          description: '将数组分到有限数量的桶子里。每个桶子再个别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排序）。',
          timeComplexity: { avg: 'O(n+k)', best: 'O(n+k)', worst: 'O(n²)' },
          spaceComplexity: 'O(n+k)',
          stable: true
        }
      }
    }
  },
  mounted() {
    this.resetArray();
  },
  methods: {
    resetArray() {
      this.sorting = false;
      this.array = [];
      this.comparing = [];
      this.sorted = [];
      for (let i = 0; i < this.arraySize; i++) {
        this.array.push(Math.floor(Math.random() * this.maxValue) + 1);
      }
    },
    getBarClass(index) {
      return {
        'comparing': this.comparing.includes(index),
        'sorted': this.sorted.includes(index)
      };
    },
    getBarColor(index) {
      if (this.sorted.includes(index)) {
        return '#4caf50';
      }
      if (this.comparing.includes(index)) {
        return '#f44336';
      }
      return '#2196f3';
    },
    async swap(i, j) {
      await this.delayFunction(this.delay);
      [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
    },
    delayFunction(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async startSorting() {
      if (this.sorting) return;
      this.sorting = true;
      this.sorted = [];
      
      switch (this.selectedAlgorithm) {
        case 'bubble':
          await this.bubbleSort();
          break;
        case 'selection':
          await this.selectionSort();
          break;
        case 'insertion':
          await this.insertionSort();
          break;
        case 'merge':
          await this.mergeSort(this.array, 0, this.array.length - 1);
          break;
        case 'quick':
          await this.quickSort(this.array, 0, this.array.length - 1);
          break;
        case 'heap':
          await this.heapSort();
          break;
        case 'shell':
          await this.shellSort();
          break;
        case 'counting':
          await this.countingSort();
          break;
        case 'radix':
          await this.radixSort();
          break;
        case 'bucket':
          await this.bucketSort();
          break;
      }
      
      this.sorting = false;
      this.comparing = [];
      this.sorted = Array.from({ length: this.array.length }, (_, i) => i);
    },
    // 冒泡排序
    async bubbleSort() {
      const n = this.array.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          this.comparing = [j, j + 1];
          await this.delayFunction(this.delay);
          if (this.array[j] > this.array[j + 1]) {
            await this.swap(j, j + 1);
          }
        }
        this.sorted.push(n - i - 1);
      }
      this.sorted.push(0);
    },
    // 选择排序
    async selectionSort() {
      const n = this.array.length;
      for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
          this.comparing = [minIndex, j];
          await this.delayFunction(this.delay);
          if (this.array[j] < this.array[minIndex]) {
            minIndex = j;
          }
        }
        if (minIndex !== i) {
          await this.swap(i, minIndex);
        }
        this.sorted.push(i);
      }
      this.sorted.push(n - 1);
    },
    // 插入排序
    async insertionSort() {
      const n = this.array.length;
      for (let i = 1; i < n; i++) {
        const key = this.array[i];
        let j = i - 1;
        this.comparing = [i];
        await this.delayFunction(this.delay);
        while (j >= 0 && this.array[j] > key) {
          this.comparing = [j, j + 1];
          await this.delayFunction(this.delay);
          this.array[j + 1] = this.array[j];
          j--;
        }
        this.array[j + 1] = key;
        this.sorted.push(...Array.from({ length: i + 1 }, (_, k) => k));
      }
    },
    // 归并排序
    async mergeSort(arr, left, right) {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await this.mergeSort(arr, left, mid);
        await this.mergeSort(arr, mid + 1, right);
        await this.merge(arr, left, mid, right);
      }
    },
    async merge(arr, left, mid, right) {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;
      
      while (i < leftArr.length && j < rightArr.length) {
        this.comparing = [left + i, mid + 1 + j];
        await this.delayFunction(this.delay);
        if (leftArr[i] <= rightArr[j]) {
          arr[k++] = leftArr[i++];
        } else {
          arr[k++] = rightArr[j++];
        }
      }
      
      while (i < leftArr.length) {
        this.comparing = [left + i];
        await this.delayFunction(this.delay);
        arr[k++] = leftArr[i++];
      }
      
      while (j < rightArr.length) {
        this.comparing = [mid + 1 + j];
        await this.delayFunction(this.delay);
        arr[k++] = rightArr[j++];
      }
      
      this.sorted.push(...Array.from({ length: right - left + 1 }, (_, index) => left + index));
    },
    // 快速排序
    async quickSort(arr, low, high) {
      if (low < high) {
        const pi = await this.partition(arr, low, high);
        await this.quickSort(arr, low, pi - 1);
        await this.quickSort(arr, pi + 1, high);
      } else if (low === high) {
        this.sorted.push(low);
      }
    },
    async partition(arr, low, high) {
      const pivot = arr[high];
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        this.comparing = [j, high];
        await this.delayFunction(this.delay);
        if (arr[j] < pivot) {
          i++;
          await this.swap(i, j);
        }
      }
      
      await this.swap(i + 1, high);
      this.sorted.push(i + 1);
      return i + 1;
    },
    // 堆排序
    async heapSort() {
      const n = this.array.length;
      
      // 构建最大堆
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await this.heapify(n, i);
      }
      
      // 一个个交换元素
      for (let i = n - 1; i > 0; i--) {
        await this.swap(0, i);
        this.sorted.push(i);
        await this.heapify(i, 0);
      }
      
      this.sorted.push(0);
    },
    async heapify(n, i) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      if (left < n) {
        this.comparing = [left, largest];
        await this.delayFunction(this.delay);
        if (this.array[left] > this.array[largest]) {
          largest = left;
        }
      }
      
      if (right < n) {
        this.comparing = [right, largest];
        await this.delayFunction(this.delay);
        if (this.array[right] > this.array[largest]) {
          largest = right;
        }
      }
      
      if (largest !== i) {
        await this.swap(i, largest);
        await this.heapify(n, largest);
      }
    },
    // 希尔排序
    async shellSort() {
      const n = this.array.length;
      
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
          const temp = this.array[i];
          let j;
          this.comparing = [i];
          await this.delayFunction(this.delay);
          
          for (j = i; j >= gap && this.array[j - gap] > temp; j -= gap) {
            this.comparing = [j - gap, j];
            await this.delayFunction(this.delay);
            this.array[j] = this.array[j - gap];
          }
          
          this.array[j] = temp;
        }
      }
      
      this.sorted = Array.from({ length: n }, (_, i) => i);
    },
    // 计数排序
    async countingSort() {
      const n = this.array.length;
      const max = Math.max(...this.array);
      const min = Math.min(...this.array);
      const range = max - min + 1;
      const count = new Array(range).fill(0);
      const output = new Array(n);
      
      // 统计每个元素出现的次数
      for (let i = 0; i < n; i++) {
        this.comparing = [i];
        await this.delayFunction(this.delay);
        count[this.array[i] - min]++;
      }
      
      // 对所有的计数累加
      for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
      }
      
      // 构建输出数组
      for (let i = n - 1; i >= 0; i--) {
        this.comparing = [i];
        await this.delayFunction(this.delay);
        output[count[this.array[i] - min] - 1] = this.array[i];
        count[this.array[i] - min]--;
      }
      
      // 将输出数组复制到原数组
      for (let i = 0; i < n; i++) {
        await this.delayFunction(this.delay);
        this.array[i] = output[i];
        this.sorted.push(i);
      }
    },
    // 基数排序
    async radixSort() {
      const max = Math.max(...this.array);
      
      for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        await this.countingSortByDigit(exp);
      }
      
      this.sorted = Array.from({ length: this.array.length }, (_, i) => i);
    },
    async countingSortByDigit(exp) {
      const n = this.array.length;
      const output = new Array(n);
      const count = new Array(10).fill(0);
      
      // 统计每个数字出现的次数
      for (let i = 0; i < n; i++) {
        this.comparing = [i];
        await this.delayFunction(this.delay);
        count[Math.floor(this.array[i] / exp) % 10]++;
      }
      
      // 对所有的计数累加
      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }
      
      // 构建输出数组
      for (let i = n - 1; i >= 0; i--) {
        this.comparing = [i];
        await this.delayFunction(this.delay);
        output[count[Math.floor(this.array[i] / exp) % 10] - 1] = this.array[i];
        count[Math.floor(this.array[i] / exp) % 10]--;
      }
      
      // 将输出数组复制到原数组
      for (let i = 0; i < n; i++) {
        await this.delayFunction(this.delay);
        this.array[i] = output[i];
      }
    },
    // 桶排序
    async bucketSort() {
      const n = this.array.length;
      if (n <= 0) return;
      
      // 创建桶
      const buckets = [];
      const bucketCount = Math.floor(Math.sqrt(n));
      const max = Math.max(...this.array);
      const min = Math.min(...this.array);
      const range = (max - min) / bucketCount;
      
      // 初始化桶
      for (let i = 0; i < bucketCount; i++) {
        buckets.push([]);
      }
      
      // 将元素放入对应的桶
      for (let i = 0; i < n; i++) {
        this.comparing = [i];
        await this.delayFunction(this.delay);
        const index = Math.min(Math.floor((this.array[i] - min) / range), bucketCount - 1);
        buckets[index].push(this.array[i]);
      }
      
      // 对每个桶进行排序
      let sortedIndex = 0;
      for (let i = 0; i < bucketCount; i++) {
        if (buckets[i].length > 0) {
          buckets[i].sort((a, b) => a - b);
          for (let j = 0; j < buckets[i].length; j++) {
            await this.delayFunction(this.delay);
            this.array[sortedIndex++] = buckets[i][j];
            this.sorted.push(sortedIndex - 1);
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.sorting-visualizations {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.controls-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
  color: #333;
}

.control-group input[type="range"] {
  width: 120px;
}

.control-group span {
  min-width: 30px;
  text-align: center;
  font-weight: 500;
}

.control-group select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.buttons-group {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

.control-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn {
  background-color: #4caf50;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-2px);
}

.reset-btn {
  background-color: #f44336;
  color: white;
}

.reset-btn:hover:not(:disabled) {
  background-color: #da190b;
  transform: translateY(-2px);
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.visualization-area {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 400px;
  margin-bottom: 2rem;
  background-color: #fafafa;
  padding: 1rem;
  border-radius: 8px;
  gap: 1px;
}

.bar {
  flex: 1;
  max-width: 40px;
  background-color: #2196f3;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  min-width: 2px;
}

.bar-value {
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding-bottom: 0.2rem;
}

.bar.comparing {
  background-color: #f44336;
  transform: scale(1.1);
}

.bar.sorted {
  background-color: #4caf50;
}

.algorithm-info {
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.algorithm-info h3 {
  color: #333;
  margin-bottom: 1rem;
}

.algorithm-info .description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.complexity {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.complexity-item {
  padding: 0.5rem 1rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .controls-panel {
    flex-direction: column;
    align-items: stretch;
  }
  
  .buttons-group {
    margin-left: 0;
    justify-content: center;
  }
  
  .visualization-area {
    height: 300px;
  }
  
  .bar-value {
    display: none;
  }
}
</style>