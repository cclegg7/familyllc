package com.familyllc.recipemanager.dto

import com.familyllc.recipemanager.entity.Instruction

data class InstructionDto(
    val id: Long = 0,
    val stepNumber: Int,
    val description: String
) {
    companion object {
        fun fromEntity(instruction: Instruction): InstructionDto {
            return InstructionDto(
                id = instruction.id,
                stepNumber = instruction.stepNumber,
                description = instruction.description
            )
        }
    }
}

data class InstructionCreateDto(
    val stepNumber: Int,
    val description: String
)
